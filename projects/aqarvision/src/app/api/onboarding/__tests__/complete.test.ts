import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "../complete/route";

// Mock Supabase client
const mockUpdate = vi.fn();
const mockEq = vi.fn();
const mockFrom = vi.fn();
const mockGetUser = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: () => ({
    auth: {
      getUser: mockGetUser,
    },
    from: mockFrom,
  }),
}));

describe("POST /api/onboarding/complete", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock chain
    mockEq.mockReturnThis();
    mockUpdate.mockReturnValue({ eq: mockEq });
    mockFrom.mockReturnValue({ update: mockUpdate });
  });

  it("should return 401 if user is not authenticated", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: new Error("Not authenticated"),
    });

    const response = await POST();

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe("Unauthorized");
  });

  it("should update onboarding state successfully", async () => {
    const mockUser = { id: "user-123", email: "test@example.com" };
    mockGetUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    mockEq.mockResolvedValue({ error: null });

    const response = await POST();

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);

    // Vérifier que les bonnes méthodes ont été appelées
    expect(mockFrom).toHaveBeenCalledWith("onboarding_state");
    expect(mockUpdate).toHaveBeenCalledWith({
      is_completed: true,
      completed_at: expect.any(String),
    });
    expect(mockEq).toHaveBeenCalledWith("user_id", mockUser.id);
  });

  it("should return 500 if database update fails", async () => {
    const mockUser = { id: "user-123", email: "test@example.com" };
    mockGetUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    const dbError = new Error("Database connection failed");
    mockEq.mockResolvedValue({ error: dbError });

    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await POST();

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe("Failed to complete onboarding");

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error completing onboarding:",
      dbError
    );

    consoleErrorSpy.mockRestore();
  });

  it("should handle unexpected errors gracefully", async () => {
    mockGetUser.mockRejectedValue(new Error("Unexpected error"));

    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await POST();

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe("Internal server error");

    expect(consoleErrorSpy).toHaveBeenCalledWith("Unexpected error:", expect.any(Error));

    consoleErrorSpy.mockRestore();
  });

  it("should set completed_at to current timestamp", async () => {
    const mockUser = { id: "user-123", email: "test@example.com" };
    mockGetUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    mockEq.mockResolvedValue({ error: null });

    const beforeTime = new Date().toISOString();
    await POST();
    const afterTime = new Date().toISOString();

    const updateCall = mockUpdate.mock.calls[0][0];
    const completedAt = updateCall.completed_at;

    // Vérifier que completed_at est entre beforeTime et afterTime
    expect(completedAt >= beforeTime).toBe(true);
    expect(completedAt <= afterTime).toBe(true);
  });
});
