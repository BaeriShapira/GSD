import SettingsBoard from "../components/settings/SettingsBoard";

export default function Settings() {
    return (
        <section className="p-2">
            <div className="px-4">
                <h1>Settings</h1>
                <p className="text-black/60 dark:text-dark-text-secondary">Tune your GSD system to fit your needs.</p>
            </div>
            <SettingsBoard />
        </section>
    );
}
