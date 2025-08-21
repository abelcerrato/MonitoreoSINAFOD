import React, { useState, useContext } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { color } from "../Components/color";
import axios from "axios";
import { useUser } from "../Components/UserContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { VerificationContext } from "../App";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const CambiarContraModal = ({
  open,
  onClose,
  mandatory = false,
  onSuccess,
}) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  //const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{5,}$/;
  const passwordRegex = /^.{5,15}$/;
  const handleTogglePassword = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Limpia error al escribir
  };

 

  const validate = () => {
    let valid = true;
    const newErrors = { newPassword: "", confirmPassword: "" };
    /* 
        if (!passwordRegex.test(passwords.newPassword)) {
            newErrors.newPassword = "Debe tener mayúscula, minúscula, número y símbolo (mínimo 5 caracteres). Los símbolos permitidos incluyen: !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
            valid = false;
        }
 */
    if (!passwordRegex.test(passwords.newPassword)) {
      newErrors.newPassword =
        "La contraseña deve tener entre 5 y 15 caracteres.";
      valid = false;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const { pauseVerification, resumeVerification } =
    useContext(VerificationContext);

  // Efecto para pausar/resumir la verificación
  React.useEffect(() => {
    if (open) {
      pauseVerification(); // Pausamos la verificación al abrir
      return () => {
        resumeVerification(); // Resumimos al cerrar
      };
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/actualizarContra/${user?.usuario}`,
        {
          nuevaContraseña: passwords.newPassword,
        }
      );

      if (response.status === 200) {
        Swal.fire({
          title: "Contraseña Actualizada",
          text: "Su contraseña ha sido actualizada exitosamente, sera rederigido/a al inicio de sección y podra ingrsar con su contraseña nueva.",
          icon: "success",
          timer: 8000,
          confirmButtonColor: color.primary.azul,
        });

        setPasswords({ newPassword: "", confirmPassword: "" });
        setErrors({ newPassword: "", confirmPassword: "" });
        navigate("/");
        if (onSuccess) {
          onSuccess(); // <- Aquí llamás la función del dashboard
        } else {
          onClose(); // Por si se usa sin `mandatory`
        }
      }
    } catch (error) {
      alert("No se cambió la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={mandatory ? undefined : onClose}
      disableEscapeKeyDown={mandatory}
    >
      <Box sx={style}>
        <Typography variant="h6" component="h2" align="center" gutterBottom>
          {user?.usuario}
        </Typography>
        <Typography variant="h6" component="h2" align="center" gutterBottom>
          {mandatory
            ? "Cambio de contraseña obligatorio"
            : "Cambiar Contraseña"}
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Nueva Contraseña"
            name="newPassword"
            type={showPassword.new ? "text" : "password"}
            value={passwords.newPassword}
            onChange={handleChange}
            error={!!errors.newPassword}
            helperText={errors.newPassword}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleTogglePassword("new")}
                    edge="end"
                    disabled={loading}
                  >
                    {showPassword.new ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Confirmar Nueva Contraseña"
            name="confirmPassword"
            type={showPassword.confirm ? "text" : "password"}
            value={passwords.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleTogglePassword("confirm")}
                    edge="end"
                    disabled={loading}
                  >
                    {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {mandatory && (
            <Typography color="error" gutterBottom>
              Por motivos de seguridad, debes cambiar tu contraseña para
              continuar.
            </Typography>
          )}

          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            {!mandatory && (
              <Button
                onClick={onClose}
                variant="outlined"
                sx={{ mr: 1 }}
                disabled={loading}
              >
                Cancelar
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ background: color.primary.azul }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Cambiar Contraseña"
              )}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default CambiarContraModal;
