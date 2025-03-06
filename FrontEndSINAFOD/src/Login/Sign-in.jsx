import { useState } from "react";
import axios from "axios";
import {
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Card,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { color } from "../Components/color";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LogoCONED from "../Components/img/logos_CONED.png"
import LogoDGDP from "../Components/img/Logo_DGDP.png"
import { useUser } from "../Components/UserContext"




// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignIn() {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ usuario: "", contraseña: "" });
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{5,}$/;

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "contraseña") {
      if (!passwordRegex.test(value)) {
        setError("La contraseña debe tener al menos 5 caracteres, una mayúscula, una minúscula, un número y un carácter especial.");
      } else {
        setError(""); // Elimina el error si la contraseña es válida
      }
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    setUser(formData.usuario);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/verificarUsuario`,
        formData
      );

      if (response.status === 200) {
        // Si la autenticación es exitosa
        localStorage.setItem("user", JSON.stringify(formData.usuario)); // Guarda usuario
        sessionStorage.setItem("isAuthenticated", "true"); // Usa sessionStorage para detectar sesión activa
        navigate("/dashboard");
      } else {
        // Aquí no debería entrar, porque si la autenticación falla, devolverá un status 401
        alert("Error en la autenticación. Verifique sus credenciales.");
      }
    } catch (error) {
      console.error("Error en la autenticación:", error);

      if (error.response) {
        // Si el servidor respondió con un error (status 401 o similar)
        if (error.response.status === 401) {
          alert(error.response.data.message); // Muestra el mensaje de error enviado por el backend
        } else {
          alert("Error en la autenticación. Inténtelo de nuevo.");
        }
      } else if (error.request) {
        // Si no se recibió respuesta del servidor
        alert("Error en la conexión con el servidor.");
      } else {
        // Si hubo un error en la configuración de la solicitud
        alert("Hubo un problema con la solicitud. Inténtelo de nuevo.");
      }
    }
  };


  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "90vh",
            flexDirection: "column",
          }}
        >
          <Card
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt:5, p: 5, boxShadow: 5, borderRadius: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <img
                  src={LogoCONED}
                  alt="Logo"
                  style={{ width: "90%", height: "90%", objectFit: "contain" }}

                /> </Grid>
              <Grid item xs={12} sm={6}>
                <img
                  src={LogoDGDP}
                  alt="Logo"
                  style={{ width: "90%", height: "90%", objectFit: "contain" }}

                />
              </Grid>
            </Grid>
            {/* <Typography
              component="h1"
              variant="h5"
              align="center"
              sx={{ marginBottom: 2 }}
            >
              Inicio de Sesión
            </Typography> */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="usuario"
              label="Usuario"
              name="usuario"
              autoComplete="usuario"
              autoFocus
              value={formData.usuario}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="contraseña"
              label="Contraseña"
              type={showPassword ? "text" : "password"} // <-- Alterna el tipo de input
              id="contraseña"
              value={formData.contraseña}
              onChange={handleChange}
              autoComplete="current-password"
              error={!!error}
              helperText={error}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: color.primary.azul }}
            >
              Ingresar
            </Button>
            <Grid container>
              <Grid item xs></Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  ¿Olvidaste tu contraseña?
                </Link>
              </Grid>
            </Grid>
          </Card>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mt: 5, py: 2 }}
          >
            {"Copyright © "}

            Propiedad intelectual del Consejo Nacional de Educación
          </Typography>
        </Box>


      </Container>
    </ThemeProvider>
  );
}
