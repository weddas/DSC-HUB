int dur = id(stage_light_hours);
if (!id(main_active) || dur <= 0) { id(lights_currently_on) = false; return; }
auto now = id(sntp_time).now();
if (!now.is_valid()) now = id(grow_time).now();
if (!now.is_valid()) return;           // no clock yet -> hold last truth
int cur  = now.hour * 60 + now.minute;
int on_m = id(lights_on_time).hour * 60 + id(lights_on_time).minute;
id(lights_currently_on) = ((cur - on_m + 1440) % 1440) < dur * 60;   // midnight wrap

