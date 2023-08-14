import React, { useState, useEffect } from "react";
import { Container, Typography, Box } from "@mui/material";
import BookCard from "../../components/BookCard";
import axios from "axios";
import md5 from "crypto-js/md5";
import { Link } from "react-router-dom";

interface Book {
  author: string;
  cover: string;
  isbn: string;
  published: number;
  title: string;
  id: number;
}

interface MyShelfPageProps {}

interface ShelfItem {
  book: Book;
  status: number;
}

interface AuthData {
  key: string;
  secret: string;
}

const MyShelfPage: React.FC<MyShelfPageProps> = () => {
  const [shelfBooks, setShelfBooks] = useState<ShelfItem[]>([]);
  const aboutUser = localStorage.getItem("auth");
  const parsedAboutUser = aboutUser ? JSON.parse(aboutUser) : null;
  const authData: AuthData | null = parsedAboutUser?.data || null;

  const userSecret = authData?.secret || "";

  const signature = md5(`GET/books${userSecret}`).toString();

  const headers = {
    Key: authData?.key,
    Sign: signature,
  };

  const fetchShelfBooks = async () => {
    try {
      const response = await axios.get("https://no23.lavina.tech/books", { headers });
      setShelfBooks(response.data.data);
    } catch (error) {
      console.error("Failed to fetch shelf books:", error);
    }
  };

  useEffect(() => {
    fetchShelfBooks();
  }, []);

  return (
    <Container style={{ marginTop: "20px" }}>
      <Typography variant="h4" gutterBottom>
        My Shelf
      </Typography>
      <Box style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginTop: "40px" }}>
        {shelfBooks ? (
          shelfBooks?.map((item) => <BookCard key={item.book.isbn} book={item.book} myshelf={true} defaultStatus={item.status} fetchShelfBooks={fetchShelfBooks} />)
        ) : (
          <>
            <p>Your shelf is empty. <Link to={'/search'}>
            Add some books!
            </Link></p>
          </>
        )}
      </Box>
    </Container>
  );
};

export default MyShelfPage;
