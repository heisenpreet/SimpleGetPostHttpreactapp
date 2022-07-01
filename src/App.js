import React from "react";
import { useState, useCallback, useEffect } from "react";
import AddMovie from "./components/AddMovie";
import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [dummyMovies, setDummyMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovieHandler = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://httppractice-86b7f-default-rtdb.firebaseio.com/movies.json"
      );
      if (!response.ok) {
        throw new Error("Something went Wrong !!!");
      }
      const data = await response.json();

      //reading the data form the objxt
      const moviesData = Object.entries(data).map((movie) => {
        return {
          id: movie[0],
          ...movie[1],
        };
      });

      setDummyMovies(moviesData);
    } catch (error) {
      setError(error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMovieHandler();
  }, [fetchMovieHandler]);

  //posting data on the dataBase//firebase

  const addMoviesHandler = useCallback(async (movie) => {
    try {
      await fetch(
        "https://httppractice-86b7f-default-rtdb.firebaseio.com/movies.json",
        {
          method: "POST",
          body: JSON.stringify(movie),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMoviesHandler}></AddMovie>
      </section>
      <section>
        <button onClick={fetchMovieHandler}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading && dummyMovies.length > 0 && (
          <MoviesList movies={dummyMovies} />
        )}
        {!isLoading && dummyMovies.length === 0 && !error && (
          <p>Found No Movies</p>
        )}
        {isLoading && <p>Loading...</p>}
        {error && <p>{`${error}`}</p>}
      </section>
    </React.Fragment>
  );
}

export default React.memo(App);
