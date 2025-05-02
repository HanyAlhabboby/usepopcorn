import { useState, useEffect } from "react";
const KEY = "612d6d84";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(
    function () {
      //callback?.();
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new console.error(
              "Something went wrong with fetching movies"
            );

          const data = await res.json();

          if (data.Response === "False") {
            setError(data.Error); // Example: "Movie not found!"
            setMovies([]); // Clear previous movies
          } else {
            setMovies(data.Search);
          }

          setIsLoading(false);
          setError("");
        } catch (err) {
          if (err.name !== "AboutError") {
            console.log(err.message);
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
