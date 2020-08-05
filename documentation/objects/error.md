# error objects

# list of errormessages const from eIDLink (src\modules\authWizard\actions\SignErrorHandleActions.js)
+ http_status_0: `http_status_0` (string) - basic error
+ no_reader: `no_reader` (string) - no reader found
+ unsupported_reader: `unsupported_reader` (string) - unsupported reader found
+ no_card: `no_card` (string) - no card found
+ card_error: `card_error` (string) - error on the card
+ pin_incorrect: `pin_incorrect` (string) - incorrect pin enterd
+ pin_too_short: `pin_too_short` (string) - entered pin is too short
+ pin_length: `pin_length` (string) - entered pin hase a incorect length 
+ pin_too_long: `pin_too_long` (string) - entered pin is too long
+ pin_3_attempts_left: `pin_3_attempts_left` (string) - 3 pin attempts left 
+ pin_2_attempts_left: `pin_2_attempts_left` (string) - 2 pin attempts left 
+ pin_1_attempt_left: `pin_1_attempt_left` (string) - 1 pin attempt left 
+ card_blocked: `card_blocked` (string) - eID card is blocked
+ pin_timeout: `pin_timeout` (string) - entering pin took to long
+ cancel: `cancel` (string) - user canceld the proces (on pinpad reader)
+ signature_failed: `signature_failed` (string) - signature failed

# pin error messages shown in the pinError (src\modules\authWizard\actions\SignErrorHandleActions.js)
+ pin_incorrect: `PIN is incorrect` (string) - text show when pin is incorrect
+ pin_too_short: `PIN is to short` (string) - text show when pin is to short
+ pin_length: `PIN doesn't have the correct length` (string) - text show when pin length is incorrect
+ pin_too_long: `PIN is too long` (string) - text show when pin too long
+ pin_3_attempts_left: `PIN is incorrect : 3 attempts remaining` (string) - text show when there are 3 pin attempts left
+ pin_2_attempts_left: `PIN is incorrect : 2 attempts remaining` (string) - text show when there are 2 pin attempts left
+ pin_1_attempt_left: `PIN is incorrect : 1 attempt remaining` (string) - text show when there is 1 pin attempt left
+ pin_timeout: `entering the PIN took too long.` (string) - text show when entering the PIN took too long

