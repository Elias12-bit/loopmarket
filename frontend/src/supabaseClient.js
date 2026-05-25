import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hhezcubnzmhuxuokdfxe.supabase.co";
const supabaseAnonKey = "sb_publishable_z44q3Qqnl-kUdlslb1m1fQ_s8cXSjj7";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;