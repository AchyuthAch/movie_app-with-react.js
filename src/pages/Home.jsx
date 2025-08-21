import MovieCard from "../components/moviecard"
import { useState, useEffect } from "react";
import '../css/Home.css'; // Assuming you have a CSS file for styling
import { searchMovies, getPopularMovies} from "../services/api";

function Home() {

    const [searchQuery, setSearchQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPopularMovies = async () => {
            try {
                const popularMovies = await getPopularMovies();
                setMovies(popularMovies);
            } catch (error) {
                console.error("Error fetching popular movies:", error);
            }
            finally {
                setLoading(false);
            }
        };
        loadPopularMovies();
    }, []);

    const handleSearch = async (e)  => {
        e.preventDefault();
        if (!searchQuery.trim()) return
        if (loading) return
        
        setLoading(true);
        try {
            const SearchResults = await searchMovies(searchQuery);
            setMovies(SearchResults);
        } catch (error) {
            console.error("Error searching movies:", error);
        } finally {
            setLoading(false);
            setError(null);
        }
    };

    return(
        <div className="home">
            <form onSubmit={handleSearch} className="search-form">
            <input type = "text"
            placeholder="Search for a movie..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-button">Search</button>
            </form>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <div className="movies-grid">
                    {movies.map((movie) => 
                        (<MovieCard key={movie.id} movie={movie} />))}
                </div>
            )}
        </div>
    )
}

export default Home