import React, { useMemo, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import md5 from "crypto-js/md5";
import axios from "axios";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";

interface Book {
  author: string;
  cover: string;
  isbn: string;
  published: number;
  title: string;
  id: number;
}

interface BookCardProps {
  book: Book;
  myshelf: boolean;
  defaultStatus: number;
  fetchShelfBooks: () => Promise<void>;
}

interface AuthData {
  key: string;
  secret: string;
}

const BookCard: React.FC<BookCardProps> = ({ book, myshelf, defaultStatus, fetchShelfBooks }) => {
  const [isAddingToShelf, setIsAddingToShelf] = useState(false);
  const [isRemovingToShelf, setIsRemovingToShelf] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [shelfBooks, setShelfBooks] = useState<Book[]>([]);
  const [status, setStatus] = useState<number>(defaultStatus);
  const aboutUser = localStorage.getItem("auth");
  const parsedAboutUser = aboutUser ? JSON.parse(aboutUser) : null;
  const authData: AuthData | null = parsedAboutUser?.data || null;
  const userSecret = authData?.secret || "";

  const refetchBooks = async () => {
    const signature = md5(`GET/books${userSecret}`).toString();
    const headers = {
      Key: authData?.key,
      Sign: signature,
    };
    try {
      const response = await axios.get("https://no23.lavina.tech/books", { headers });
      setShelfBooks(response.data.data.map((shelfItem: any) => shelfItem.book));
    } catch (error) {
      console.error("Failed to fetch shelf books:", error);
    }
  };

  const onClickAdd = async () => {
    if (isAddingToShelf) {
      return;
    }
    setIsAddingToShelf(true);
    const signature = md5(`POST/books{"isbn":"${book.isbn}"}${userSecret}`).toString();
    try {
      const response = await axios.post(`https://no23.lavina.tech/books`, { isbn: book.isbn }, { headers: { Key: authData?.key, Sign: signature } });
      if (response.data.isOk) {
        alert("Add to shelf successful!");
        refetchBooks();
      }
    } catch (error) {
      console.error("Add to shelf failed:", error);
    } finally {
      setIsAddingToShelf(false);
    }
  };

  const onClickRemove = async () => {
    if (isRemovingToShelf) {
      return;
    }
    setIsRemovingToShelf(true);
    const signature = md5(`DELETE/books/${book.id}${userSecret}`).toString();
    try {
      const response = await axios.delete(`https://no23.lavina.tech/books/${book.id}`, { headers: { Key: authData?.key, Sign: signature } });
      fetchShelfBooks();
      console.log("Response data:", response.data.data);
    } catch (error) {
      console.error("Remove from shelf failed:", error);
    } finally {
      setIsRemovingToShelf(false);
    }
  };

  const handleChange = async (event: SelectChangeEvent) => {
    const newValue = parseInt(event.target.value as string, 10);
    const signature = md5(`PATCH/books/${book.id}{"status":${newValue.toString()}}${userSecret}`).toString();
    setIsUpdatingStatus(true);
    try {
      const response = await axios.patch(`https://no23.lavina.tech/books/${book.id}`, { status: newValue }, { headers: { Key: authData?.key, Sign: signature } });
      console.log("Response data:", response.data.data);
    } catch (error) {
      console.error("Remove from shelf failed:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
    setStatus(newValue);
  };

  const isBookInShelf = useMemo(() => {
    return shelfBooks.some((shelfBook) => shelfBook.isbn === book.isbn);
  }, [shelfBooks, book.isbn]);

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia sx={{ height: 140 }} image={book.cover} title="green iguana" />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" noWrap>
          {book.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {book.author}
        </Typography>

        {myshelf ? (
          <Box style={{ marginTop: "10px" }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">{isUpdatingStatus ? "Changing status..." : "Status"}</InputLabel>
              <Select labelId="demo-simple-select-label" id="demo-simple-select" value={status.toString()} label="Status" onChange={handleChange}>
                <MenuItem value="0">New</MenuItem>
                <MenuItem value="1">Reading</MenuItem>
                <MenuItem value="2">Finished</MenuItem>
              </Select>
            </FormControl>
          </Box>
        ) : (
          ""
        )}
      </CardContent>
      <CardActions>
        {myshelf || isBookInShelf ? (
          <Button size="small" onClick={onClickRemove} disabled={isRemovingToShelf}>
            {isRemovingToShelf ? "Removing..." : "Remove from shelf"}
          </Button>
        ) : (
          <Button size="small" onClick={onClickAdd} disabled={isAddingToShelf}>
            {isAddingToShelf ? "Adding..." : "Add to shelf"}
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default BookCard;
