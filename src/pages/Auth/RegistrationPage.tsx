import React, { useState } from "react";
import { Container, TextField, Button, Typography } from "@mui/material";
import axios, { AxiosError } from "axios";

interface CustomError {
  message: string;
}

interface RegistrationFormData {
  name: string;
  email: string;
  key: string;
  secret: string;
}

const RegistrationPage: React.FC = () => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: "",
    email: "",
    key: "",
    secret: "",
  });

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();

    const requestBody = {
      name: formData.name,
      email: formData.email,
      key: formData.key,
      secret: formData.secret,
    };

    try {
      const response = await axios.post("https://no23.lavina.tech/signup", requestBody);
      if (response?.data?.isOk) {
        alert("Registration successful!");
        localStorage.setItem("auth", JSON.stringify(response.data));
        window.location.href = "/my-shelf";
      }
    } catch (error) {
      const response = (error as AxiosError<CustomError>)?.response;
      if (response?.data?.message) {
        alert(`Registration failed: ${response.data.message}`);
      } else {
        alert(`Registration failed: ${error}`);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Container maxWidth="xs" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <Typography variant="h4" gutterBottom>
        Register an Account
      </Typography>
      <form onSubmit={handleRegistration}>
        <TextField label="Full Name" fullWidth margin="normal" name="name" value={formData.name} onChange={handleInputChange} />
        <TextField label="Email" type="email" fullWidth margin="normal" name="email" value={formData.email} onChange={handleInputChange} />
        <TextField label="Key" fullWidth margin="normal" name="key" value={formData.key} onChange={handleInputChange} />
        <TextField label="Secret" fullWidth margin="normal" name="secret" value={formData.secret} onChange={handleInputChange} />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Register
        </Button>
      </form>
    </Container>
  );
};

export default RegistrationPage;
