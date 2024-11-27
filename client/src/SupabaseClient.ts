import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://llkfhzdeqvgnnucloiqp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxsa2ZoemRlcXZnbm51Y2xvaXFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2OTA3NDMsImV4cCI6MjA0ODI2Njc0M30.5gay0RSx_OsbbGmzOpgAqWCDtaHSucdPIyANGlZ9OHk';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
