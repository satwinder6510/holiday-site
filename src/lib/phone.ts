/**
 * Phone numbers shown on the site. River cruise pages carry their own line
 * (owner 26 Nov 2026) so 3CX can tell cruise calls apart by the number dialled.
 */
export interface Phone { display: string; tel: string }
export const MAIN_PHONE: Phone = { display: '0208 183 0518', tel: 'tel:02081830518' };
export const CRUISE_PHONE: Phone = { display: '0208 183 0495', tel: 'tel:02081830495' };
