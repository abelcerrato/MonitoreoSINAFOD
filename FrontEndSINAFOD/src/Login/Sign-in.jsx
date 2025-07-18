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
import Swal from "sweetalert2";



// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignIn() {
  const { setUser, setPermissions } = useUser();
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

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/inicioSesion`,
        formData
      );

      if (response.status === 200) {
        const { id, usuario, idrol } = response.data.user;
        const { token, message, yaHabiaSesion } = response.data;

        // Guardar el usuario en el contexto global
        setUser({ id, usuario, idrol });

        // Guardar en localStorage
        localStorage.setItem("user", JSON.stringify({
          id,
          usuario,
        }));
        localStorage.setItem("token", token);

        const permisosResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/permisos/${idrol}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (permisosResponse.status === 200) {
          const permisos = permisosResponse.data.map(p => ({
            idobjeto: p.idobjeto,
            objeto: p.objeto,
            idmodulo: p.idmodulo,
            consultar: p.consultar,
            insertar: p.insertar,
            actualizar: p.actualizar,
          }));

          setPermissions(permisos); // Guardar en contexto y localStorage
        }
        // Mostrar mensaje de éxito (si no es caso de sesión activa)
        Swal.fire({
          icon: yaHabiaSesion ? 'info' : 'success',
          title: 'Inicio de sesión',
          text: yaHabiaSesion
            ? 'Existe una sesión abierta en otro dispositivo. Por motivos de seguridad, fue cerrada.'
            : message,
          timer: 3000,
          showConfirmButton: false
          
        });

        // Indicar que la sesión está activa
        sessionStorage.setItem("isAuthenticated", "true");

        // Redirigir al dashboard
        navigate("/dashboard");
      }
    } catch (error) {
      // Manejo de errores existente...
      if (error.response) {
        if (error.response.status === 401) {
          Swal.fire({
            title: "Error",
            text: error.response.data.message,
            icon: "error",
            timer: 6000,
            confirmButtonColor: color.primary.rojo,
          });
        } else if (error.response.status === 403) {
          const { id, usuario, token } = error.response.data.user; // Asegúrate de recibir el token desde el backend

          // Guardar en localStorage
          localStorage.setItem("user", JSON.stringify({
            id,
            usuario,
            requiresPasswordChange: true
          }));
          localStorage.setItem("token", token); // ¡IMPORTANTE! Sin esto, ProtectedRoute bloqueará el acceso

          // Actualizar el contexto
          setUser({
            id,
            usuario,
            changePasswordRequired: true
          });

          // Marcar como autenticado
          sessionStorage.setItem("isAuthenticated", "true");

          // Redirigir al dashboard
          navigate("/dashboard", { replace: true }); // Usa replace para evitar problemas de navegación
        } else {
          Swal.fire({
            title: "Error",
            text: error.response.data.message,
            icon: "error",
            timer: 6000,
            confirmButtonColor: color.primary.rojo,
          });
         
        }
      } else if (error.request) {
        alert("Error en la conexión con el servidor.");
      } else {
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
            sx={{ mt: 5, p: 5, boxShadow: 5, borderRadius: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} size={6}>
                <img
                  src={LogoCONED}
                  alt="Logo"
                  style={{ width: "90%", height: "90%", objectFit: "contain" }}

                /> </Grid>
              <Grid item xs={12} size={6}>
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
            {/* <Grid container>
              <Grid item xs></Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  ¿Olvidaste tu contraseña?
                </Link>
              </Grid>
            </Grid> */}
          </Card>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mt: 5, py: 2 }}
          >
            {"Copyright © "}

        Propiedad Intelectual del Estado de Honduras
          </Typography>
        </Box>


      </Container>
    </ThemeProvider>
  );
}
