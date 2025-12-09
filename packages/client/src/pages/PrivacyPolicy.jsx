export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy – GSD</h1>
                <p className="text-gray-600 mb-8">Last Updated: December 2025</p>

                <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 mb-6">
                        GSD ("we", "our", "the Service") is a productivity and time-management platform that helps users organize tasks, projects, and schedules. This Privacy Policy describes how we collect, use, store, and protect your personal information in connection with the use of the Service.
                    </p>
                    <p className="text-gray-700 mb-8">
                        By accessing or using GSD, you consent to the terms of this Privacy Policy.
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3">1.1 Information You Provide Directly</h3>
                        <p className="text-gray-700 mb-3">When creating or using an account, you may provide:</p>
                        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                            <li>Name or display name</li>
                            <li>Email address</li>
                            <li>Tasks, projects, notes, time-blocks, and any content manually entered into the system</li>
                            <li>Optional feedback you submit</li>
                        </ul>
                        <p className="text-gray-700 mb-4">We do not request unnecessary personal information.</p>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3">1.2 Information We Access Via Google Services (Optional)</h3>
                        <p className="text-gray-700 mb-3">If you choose to connect your Google account, we may request access to:</p>
                        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                            <li>Google Calendar (read/write): for viewing, creating, and syncing events and time-blocks</li>
                            <li>Google Drive (optional future feature): for attaching or storing user files</li>
                        </ul>

                        <p className="text-gray-700 font-semibold mb-2">We do NOT access:</p>
                        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                            <li>Gmail content</li>
                            <li>Contacts</li>
                            <li>Google Photos</li>
                            <li>Files or data not explicitly requested</li>
                        </ul>

                        <p className="text-gray-700 mb-4">
                            You may revoke these permissions at any time via:<br />
                            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">Google Account → Security → Third-party access</span>
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
                        <p className="text-gray-700 mb-3">We use your information exclusively for:</p>
                        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                            <li>Displaying and managing your tasks, projects, and time-blocks</li>
                            <li>Syncing your data with Google Calendar (if connected)</li>
                            <li>Providing customer support</li>
                            <li>Improving system performance and user experience</li>
                            <li>Ensuring the stability and security of the Service</li>
                        </ul>

                        <p className="text-gray-700 font-semibold mb-2">We do NOT:</p>
                        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                            <li>Sell your data</li>
                            <li>Trade your data</li>
                            <li>Share your data with advertisers</li>
                            <li>Use your personal content for AI training</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Storage and Security</h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li>Data is stored on secure cloud servers that comply with industry-standard protections.</li>
                            <li>Transport Layer Security (TLS) is used to encrypt communication between the client and server.</li>
                            <li>Access to production systems is restricted to authorized personnel only.</li>
                            <li>Regular updates and security practices are applied to reduce risk.</li>
                        </ul>
                        <p className="text-gray-700 mt-4 italic">
                            While we take extensive measures to protect your information, no online platform can guarantee complete security.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Cookies and Local Storage</h2>
                        <p className="text-gray-700 mb-3">We may use cookies and/or local browser storage for:</p>
                        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                            <li>Authentication and session maintenance</li>
                            <li>Saving user preferences</li>
                            <li>Improving performance</li>
                        </ul>
                        <p className="text-gray-700">We do not use tracking or advertising cookies.</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Sharing Information With Third Parties</h2>
                        <p className="text-gray-700 mb-4">We share information only in the following cases:</p>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1 Google APIs</h3>
                        <p className="text-gray-700 mb-4">
                            If you grant permission, we use Google Calendar or Drive APIs solely for the intended functionality of the Service.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2 Service Providers</h3>
                        <p className="text-gray-700 mb-3">We may use third-party infrastructure such as:</p>
                        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                            <li>Vercel (frontend hosting)</li>
                            <li>Railway (backend hosting)</li>
                            <li>Database or logging providers</li>
                        </ul>
                        <p className="text-gray-700 mb-4">
                            These providers are used only for hosting and operating the Service and may access data strictly as needed for system functionality.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3">5.3 Legal Requirements</h3>
                        <p className="text-gray-700 mb-4">
                            We may disclose information if required to comply with applicable law, regulation, or legal process.
                        </p>
                        <p className="text-gray-700">
                            We do not share personal data with advertisers, marketing networks, or unrelated third parties.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention and Deletion</h2>
                        <p className="text-gray-700 mb-4">
                            We retain your data only for as long as your account remains active.
                        </p>
                        <p className="text-gray-700 mb-3">You may request:</p>
                        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                            <li>Deletion of your account</li>
                            <li>Removal of all data associated with your account</li>
                            <li>Revocation of Google permissions</li>
                            <li>Export of your data (feature under development)</li>
                        </ul>
                        <p className="text-gray-700 mb-2">
                            To request data deletion, contact us at:<br />
                            <a href="mailto:gsd.app.dev@gmail.com" className="text-blue-600 hover:underline">gsd.app.dev@gmail.com</a>
                        </p>
                        <p className="text-gray-700">Deletion requests are processed within 30 days.</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Children's Privacy</h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li>GSD is not intended for use by individuals under the age of 13.</li>
                            <li>We do not knowingly collect information from children.</li>
                            <li>If such information is discovered, it will be deleted promptly.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. International Data Transfers</h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li>Your information may be stored or processed in data centers outside your country of residence.</li>
                            <li>By using the Service, you consent to such transfers.</li>
                            <li>All transfers comply with applicable data protection regulations.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Privacy Policy</h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            <li>We may update this Privacy Policy periodically.</li>
                            <li>Changes will be posted on this page with a revised "Last Updated" date.</li>
                            <li>Continued use of the Service after such updates constitutes your acceptance of the changes.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Information</h2>
                        <p className="text-gray-700 mb-4">
                            If you have questions or concerns regarding this Privacy Policy or your data, contact us at:
                        </p>
                        <p className="text-gray-700">
                            <strong>Email:</strong> <a href="mailto:gsd.app.dev@gmail.com" className="text-blue-600 hover:underline">gsd.app.dev@gmail.com</a><br />
                            <strong>Subject:</strong> Privacy Request – GSD
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
