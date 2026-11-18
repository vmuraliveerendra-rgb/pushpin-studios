/**
 * Supabase Database Integration Configuration (Pushpin Studios)
 * 
 * To connect Supabase:
 * 1. Create a project at https://supabase.com
 * 2. Add your SUPABASE_URL and SUPABASE_ANON_KEY below.
 * 3. Run the SQL schema provided in schema.sql.
 */

const SUPABASE_CONFIG = {
  url: 'YOUR_SUPABASE_PROJECT_URL', // e.g. https://xyzcompany.supabase.co
  anonKey: 'YOUR_SUPABASE_ANON_KEY' // e.g. eyJhbGciOi...
};

// Ready-to-use Supabase client loader
let supabaseClient = null;

async function getSupabase() {
  if (supabaseClient) return supabaseClient;
  if (!SUPABASE_CONFIG.url || SUPABASE_CONFIG.url === 'YOUR_SUPABASE_PROJECT_URL') {
    console.info('Supabase not configured yet. Bookings operate in local simulation mode.');
    return null;
  }

  if (window.supabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    return supabaseClient;
  }
  return null;
}

/**
 * Save booking into Supabase 'bookings' table
 */
async function saveBookingToSupabase(bookingData) {
  const sb = await getSupabase();
  if (!sb) return { success: true, localOnly: true };

  try {
    const { data, error } = await sb
      .from('bookings')
      .insert([
        {
          session_id: bookingData.sessionId,
          client_name: bookingData.clientName,
          client_phone: bookingData.clientPhone,
          client_email: bookingData.clientEmail,
          service_key: bookingData.serviceKey,
          booking_date: bookingData.date,
          booking_time: bookingData.time,
          duration_hours: bookingData.durationHours,
          addons: bookingData.addons,
          total_price: bookingData.finalPrice,
          status: 'pending_confirmation',
          notes: bookingData.notes
        }
      ]);

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Error saving to Supabase:', err);
    return { success: false, error: err };
  }
}
