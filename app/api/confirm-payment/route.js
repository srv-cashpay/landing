export async function POST(req: Request) {
    try {
      const body = await req.json();
  
      const response = await fetch("http://103.127.134.78:2358/midtrans/callback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        return new Response(
          JSON.stringify({ error: "Gagal konfirmasi", detail: errorText }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
  
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err: any) {
      return new Response(
        JSON.stringify({ error: "Server error", message: err.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
  