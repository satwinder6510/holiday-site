# TODO — holiday-site

- [ ] **Delete `assets/js/paxdetails.js`** (dead .NET-era file, 404s on the live
  site) — it carries the leaked Privyr webhook token `X-TOKEN` in the working
  tree. Context: Privyr webhook is being spammed via this token (2026-08-13);
  Privyr has no self-serve token rotation, so owner is asking Privyr support to
  rotate / closing the account. Deleting the file is hygiene only — the token
  also lives in git history, so the Privyr-side kill is the real fix. See
  `SECURITY-CHANGES-2026-07-02.md` §1.
