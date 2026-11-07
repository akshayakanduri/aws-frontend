import { useEffect, useState } from "react";
import API_BASE_URL from "../../api";
import Navbar from "../Navbar";
import "./dashboard.css";


const Dashboard = () => {
    const [repositories, setRepositories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestedRepositories, setSuggestedRepositories] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const userId = localStorage.getItem("userId");

        const fetchRepositories = async () => {
            if (!userId) {
                console.error("User ID not found. Please login.");
                return;
            }

            try {
                const response = await fetch(
                    `${API_BASE_URL}/repo/user/${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch user repositories");
                }

                const data = await response.json();

                setRepositories(
                    Array.isArray(data.repositories)
                        ? data.repositories
                        : []
                );

            } catch (err) {
                console.error("Error while fetching repositories:", err);
                setRepositories([]);
            }
        };

        const fetchSuggestedRepositories = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/repo/all`);

                if (!response.ok) {
                    throw new Error("Failed to fetch suggested repositories");
                }

                const data = await response.json();

                setSuggestedRepositories(
                    Array.isArray(data) ? data : []
                );

            } catch (err) {
                console.error("Error while fetching suggested repositories:", err);
                setSuggestedRepositories([]);
            }
        };

        fetchRepositories();
        fetchSuggestedRepositories();

    }, []);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults(repositories);
        } else {
            const filteredRepo = repositories.filter((repo) =>
                repo.name.toLowerCase().includes(searchQuery.toLowerCase())
            );

            setSearchResults(filteredRepo);
        }
    }, [searchQuery, repositories]);

    return (
        <>
            <Navbar />

            <section id="dashboard">

                <aside>
                    <h3>Suggested Repositories</h3>

                    {suggestedRepositories.map((repo) => (
                        <div key={repo._id}>
                            <h4>{repo.name}</h4>
                            <h4>{repo.description}</h4>
                        </div>
                    ))}
                </aside>

                <main>
                    <h2>Your Repositories</h2>

                    <div id="search">
                        <input
                            type="text"
                            value={searchQuery}
                            placeholder="Search..."
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {searchResults.length === 0 ? (
                        <p>No repositories found.</p>
                    ) : (
                        searchResults.map((repo) => (
                            <div key={repo._id}>
                                <h4>{repo.name}</h4>
                                <h4>{repo.description}</h4>
                            </div>
                        ))
                    )}
                </main>

                <aside>
                    <h3>Upcoming Events</h3>

                    <ul>
                        <li><p>Tech Conference - Dec 15</p></li>
                        <li><p>Developer Meetup - Dec 25</p></li>
                        <li><p>React Summit - Jan 5</p></li>
                    </ul>
                </aside>

            </section>
        </>
    );
};

export default Dashboard;
