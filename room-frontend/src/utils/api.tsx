/** @format */

// utils/api.ts

interface APIOptions {
  method?: string;
  body?: any;
  headers?: HeadersInit;
}

interface DetailError {
  type: string;
  loc: string[];
  msg: string;
  // その他のプロパティがあればここに追加
}

export async function fetchAPI(
  endpoint: string,
  { method = "GET", body = null, headers = new Headers() }: APIOptions = {}
) {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`;
  console.log("API Base URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
  console.log("Fetching:", url);

  // headersがundefinedでないことを確認し、Content-Typeを設定する
  if (!(headers instanceof Headers)) {
    headers = new Headers(headers);
  }

  if (body) {
    headers.set("Content-Type", "application/json"); // setメソッドを使用してContent-Typeを設定する
    body = JSON.stringify(body);
  }

  const options: RequestInit = { method, headers, body };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorBody = await response.json();
      console.error("Error response body:", errorBody);

      if (errorBody.detail && Array.isArray(errorBody.detail)) {
        errorBody.detail.forEach((detailError: DetailError) => {
          console.error("Validation error details:", detailError);
          if (detailError.loc) {
            console.error(
              "Missing or invalid field:",
              detailError.loc.join(" > ")
            );
          }
        });
      }
      throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error in fetchAPI:", error);
    throw error;
  }
}

export const getRooms = (): Promise<any[]> => fetchAPI("/rooms");
export const getRoomById = (id: string): Promise<any> =>
  fetchAPI(`/rooms/${id}`);
export const createBooking = (data: any): Promise<any> =>
  fetchAPI("/bookings", { method: "POST", body: data });
export const cancelBooking = (bookingId: string): Promise<any> =>
  fetchAPI(`/bookings/${bookingId}`, { method: "DELETE" });

export const getBookings = (): Promise<any[]> => fetchAPI("/bookings");
export const getBookingById = (id: string): Promise<any> =>
  fetchAPI(`/bookings/${id}`);
export const updateBooking = (bookingId: string, data: any): Promise<any> =>
  fetchAPI(`/bookings/${bookingId}`, { method: "PUT", body: data });
export const deleteBooking = (bookingId: string): Promise<any> =>
  fetchAPI(`/bookings/${bookingId}`, { method: "DELETE" });
export const getguests = (): Promise<any[]> => fetchAPI("/guest_users");

export const getRoomCapacity = async (roomId: number): Promise<number> => {
  try {
    const room = await fetchAPI(`/rooms/${roomId}`);
    return room.capacity || 0;
  } catch (error) {
    console.error("Failed to fetch room capacity:", error);
    return 0;
  }
};

export async function getUserIdByEmployeeNumber(employeeNumber: string) {
  try {
    const response = await fetchAPI(`/users/employee_number/${employeeNumber}`);
    if (!response.ok) {
      throw new Error("Failed to retrieve user information.");
    }
    const userInfo = await response.json();
    return userInfo.user_id;
  } catch (error) {
    console.error("Error:", error);
    throw error; // エラーを再スローするか、適切な方法でハンドリング
  }
}
