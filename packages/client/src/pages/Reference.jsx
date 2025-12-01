import { useParams } from "react-router-dom";
import ReferenceBoard from "../components/reference/ReferenceBoard";
import FolderBoard from "../components/reference/folder/FolderBoard";

export default function Reference() {
    const { folderId } = useParams();

    // אם יש folderId בURL, נציג את FolderBoard
    if (folderId) {
        return (
            <section className="p-2">
                <div className="px-4">
                    <h1>Reference</h1>
                    <p> Keep important info organized and accessible.</p>
                </div>
                <FolderBoard />
            </section>
        );
    }

    // אחרת, נציג את ReferenceBoard
    return (
        <section className="p-2">
            <div className="px-4">
                <h1> Reference </h1>
                <p> Keep important info organized and accessible. </p>
            </div>

            <ReferenceBoard />
        </section>
    );
}
