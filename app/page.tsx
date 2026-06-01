import { supabase } from "@/lib/supabase";

export default async function Home() {
  const { data } = await supabase.from("menu_items").select("*");

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Silvia's Dopamine Menu</h1>
      <p className="mt-4">Connected to Supabase.</p>
      <pre className="mt-4 bg-gray-100 p-4 rounded">{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}