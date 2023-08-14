import React, { useState } from "react";
import { Container, TextField, Button, Typography, CircularProgress, Box } from "@mui/material";
import axios from "axios";
import md5 from "crypto-js/md5";
import BookCard from "../../components/BookCard";

interface SearchResult {
  author: string;
  cover: string;
  isbn: string;
  published: number;
  title: string;
  id: number;
}

interface AuthData {
  key: string;
  secret: string;
}

const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const aboutUser = localStorage.getItem("auth");
  const parsedAboutUser = aboutUser ? JSON.parse(aboutUser) : null;
  const authData: AuthData | null = parsedAboutUser?.data || null;

  const handleSearch = async () => {
    setIsLoading(true);
    const userSecret = authData?.secret || "";

    const signature = md5(`GET/books/${searchQuery}${userSecret}`).toString();

    try {
      const headers = {
        Key: authData?.key,
        Sign: signature,
      };
      const response = await axios.get(`https://no23.lavina.tech/books/${searchQuery}`, { headers });
      console.log("Response data:", response.data.data);
      if (response?.data?.data.length > 0) {
        setSearchResults(response.data.data);
      } else {
        alert(`Not found! Please try another books :)`);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchShelfBooks = async () => {
    console.log('fetchShelfBooks')
  };

  return (
    <Container style={{marginTop: '20px'}}>
      <Typography variant="h4" gutterBottom>
        Search Page
      </Typography>
      <TextField label="Search books" fullWidth margin="normal" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      <Button variant="contained" color="primary" onClick={handleSearch} style={{ height: "50px", width: "100%" }}>
        {isLoading ? <CircularProgress color="inherit" /> : "Search"}
      </Button>
      <Box style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginTop: "40px" }}>
        {searchResults.length > 0 ? searchResults.map((result, index) => <BookCard key={index} fetchShelfBooks={fetchShelfBooks} book={result} myshelf={false} defaultStatus={0}/>) : ""}
      </Box>
    </Container>
  );
};

export default SearchPage;
