NEW LIFE CHURCH BAGSHOT — WEBSITE HANDOVER

Open index.html to review the draft. For full content editing, serve the folder over HTTP, rather than opening it as a file. Text included in the HTML remains visible if JavaScript or the data files cannot load.

GOING LIVE
1. Create a church-owned GitHub repository and upload these files. Connect it to a church-owned Netlify account. Set the publish directory to the repository root. Netlify builds from the repository; no build command is needed.
2. Connect the existing domain in Netlify, following its DNS instructions. Keep access to the domain with the church.
3. Set up a compatible GitHub OAuth authentication service for Decap CMS. Replace the repo and base_url placeholders in admin/config.yml. Do not put secrets in this repository. The GitHub users who edit need appropriate repository access. Test authentication, editing and publication with a second account before handing it to the team. The editor is not operational until this is done.
4. Check the church name and published wording, add verified gathering times, full address, and contact details. Review photographs and permission for public use. Add a privacy notice appropriate to any forms, analytics or personal data actually used. The present website has no form, analytics or mailing list.
5. Test every link, phone layout, keyboard navigation and editing workflow, including reverting an accidental change. Assign at least two trusted owners to the domain, repository, hosting and identity service; enable multi-factor authentication and keep recovery details securely.

EDITOR SCOPE
The admin contains fields for the four secondary pages and selected home page wording. Other home sections, photos and site structure still require editing the files. Although media uploads are enabled in the editor configuration, page fields are not connected to uploaded photos. Do not consider this a complete photo manager. Changes update JSON and appear on the hosted site after publication; the HTML contains fallback text and must also be updated if offline fallback needs to match.

Photograph on About: the hall during building investigation, not the completed renovation. Replace with current, consented photographs when available. The contact page currently has no working contact mechanism; this and meeting details must be completed before public launch.
