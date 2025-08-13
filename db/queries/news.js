import axios from "axios";

const API_KEY = process.env.NEWS_API_KEY;

const apiClient = axios.create({
  baseURL: "https://newsapi.org/v2",
});

export async function getNews(search, page) {
  const url = `/everything?q=${encodeURIComponent(
    search
  )}&apiKey=${API_KEY}&pageSize=50&page=${page}`;
  try {
    const response = await apiClient.get(url, {
      headers: { "User-Agent": "MyNewsApp/1.0" },
    });
    return {
      articles: response.data.articles,
      totalResults: response.data.totalResults,
    };
  } catch (err) {
    console.error("Request failed:", err.response?.status, err.response?.data);
    throw err;
  }
}
