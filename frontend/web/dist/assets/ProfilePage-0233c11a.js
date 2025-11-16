import { r as reactExports, j as jsxRuntimeExports, X as XMarkIcon, L as LoadingOverlay, A as Avatar, Q as QrCodeIcon, u as useAuth, g as useToast, m as updateProfile } from "./index-74821ec3.js";
import { B as Breadcrumbs } from "./Breadcrumbs-efb8820d.js";
import { T as TextField } from "./TextField-8bd0f895.js";
import { S as SubmitButton } from "./SubmitButton-51e46fc3.js";
import { P as PhotoIcon } from "./PhotoIcon-382c3ecc.js";
import { g as getMyProfile } from "./socialService-5a59fc5f.js";
import { u as useQuery } from "./useQuery-9e6818c0.js";
import { T as TrophyIcon } from "./TrophyIcon-68cfba8d.js";
import { u as useForm } from "./index.esm-0ed2c915.js";
import { o as objectType, s as stringType, a as arrayType, t } from "./types-b8c6b9bb.js";
import "./utils-814f13d4.js";
function EnvelopeIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /* @__PURE__ */ reactExports.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ reactExports.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ reactExports.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
  }));
}
const ForwardRef = /* @__PURE__ */ reactExports.forwardRef(EnvelopeIcon);
const EnvelopeIcon$1 = ForwardRef;
const ImageUpload = ({
  currentImageUrl,
  onImageChange,
  label = "Foto de perfil",
  maxSizeMB = 5
}) => {
  const fileInputRef = reactExports.useRef(null);
  const [preview, setPreview] = reactExports.useState(currentImageUrl || null);
  const [error, setError] = reactExports.useState(null);
  const handleFileSelect = (event) => {
    var _a;
    const file = (_a = event.target.files) == null ? void 0 : _a[0];
    if (!file)
      return;
    if (!file.type.startsWith("image/")) {
      setError("Por favor selecciona un archivo de imagen");
      return;
    }
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`La imagen debe ser menor a ${maxSizeMB}MB`);
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setPreview(base64String);
      onImageChange(base64String);
    };
    reader.onerror = () => {
      setError("Error al leer el archivo");
    };
    reader.readAsDataURL(file);
  };
  const handleRemove = () => {
    setPreview(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const handleClick = () => {
    var _a;
    (_a = fileInputRef.current) == null ? void 0 : _a.click();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    label && /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-slate-700 dark:text-slate-200", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: preview ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: preview,
            alt: "Preview",
            className: "h-24 w-24 rounded-full object-cover border-4 border-slate-200 dark:border-slate-700 shadow-md"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: handleRemove,
            className: "absolute -top-2 -right-2 p-1 rounded-full bg-error-500 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error-600",
            "aria-label": "Eliminar imagen",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(XMarkIcon, { className: "h-4 w-4" })
          }
        )
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          onClick: handleClick,
          className: "h-24 w-24 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(PhotoIcon, { className: "h-8 w-8 text-slate-400 dark:text-slate-500" })
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: fileInputRef,
            type: "file",
            accept: "image/*",
            onChange: handleFileSelect,
            className: "hidden"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: handleClick,
            className: "btn-secondary text-sm",
            children: preview ? "Cambiar foto" : "Subir foto"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-xs text-slate-500 dark:text-slate-400", children: [
          "JPG, PNG o GIF. Máximo ",
          maxSizeMB,
          "MB"
        ] })
      ] })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-error-500 font-medium", role: "alert", children: error })
  ] });
};
const ProfileCard = () => {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["myProfile"],
    queryFn: ({ signal }) => getMyProfile(signal)
  });
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingOverlay, { message: "Cargando perfil" });
  }
  if (!profile) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card bg-gradient-to-br from-primary-50/50 to-primary-100/30 dark:from-primary-900/20 dark:to-primary-800/10 border-primary-200 dark:border-primary-800", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center text-center space-y-4 p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Avatar,
      {
        user: {
          name: profile.name,
          profilePictureUrl: profile.profilePictureUrl
        },
        size: "xl"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-slate-900 dark:text-white", children: profile.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 mt-2 text-sm text-slate-600 dark:text-slate-400", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(EnvelopeIcon$1, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: profile.email })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 mt-2 text-sm text-slate-600 dark:text-slate-400", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TrophyIcon, { className: "h-4 w-4 text-yellow-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          profile.points,
          " puntos"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full pt-4 border-t border-slate-200 dark:border-slate-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-slate-700 dark:text-slate-300 mb-3", children: "Mi código QR" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: profile.qrCodeBase64 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: profile.qrCodeBase64.startsWith("data:") ? profile.qrCodeBase64 : `data:image/png;base64,${profile.qrCodeBase64}`,
          alt: "QR Code",
          className: "w-48 h-48 border-4 border-white dark:border-slate-800 rounded-lg shadow-lg",
          onError: (e) => {
            var _a;
            console.error("Error loading QR code:", (_a = profile.qrCodeBase64) == null ? void 0 : _a.substring(0, 50));
            e.currentTarget.style.display = "none";
          }
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-48 h-48 border-4 border-slate-300 dark:border-slate-600 rounded-lg shadow-lg flex items-center justify-center bg-slate-100 dark:bg-slate-800", children: /* @__PURE__ */ jsxRuntimeExports.jsx(QrCodeIcon, { className: "h-24 w-24 text-slate-400 dark:text-slate-500" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400 mt-2", children: "Comparte este código para que otros te agreguen como amigo" })
    ] })
  ] }) });
};
const categories = ["Technology", "Wellness", "Sports", "Entrepreneurship", "Art", "Science", "Education", "Networking"];
const profileSchema = objectType({
  name: stringType().min(2, "El nombre debe tener al menos 2 caracteres").max(100, "El nombre es demasiado largo"),
  preferredCategories: arrayType(stringType()).optional()
});
const ProfilePage = () => {
  var _a;
  const { user, refreshProfile } = useAuth();
  const { pushToast } = useToast();
  const [profilePictureUrl, setProfilePictureUrl] = reactExports.useState((user == null ? void 0 : user.profilePictureUrl) || null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: t(profileSchema),
    defaultValues: {
      name: (user == null ? void 0 : user.name) ?? "",
      preferredCategories: (user == null ? void 0 : user.preferredCategories) ?? []
    }
  });
  reactExports.useEffect(() => {
    if (user) {
      reset({ name: user.name, preferredCategories: user.preferredCategories || [] });
      setProfilePictureUrl(user.profilePictureUrl || null);
    }
  }, [user, reset]);
  if (!user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingOverlay, { message: "Cargando perfil" });
  }
  const onSubmit = async (values) => {
    try {
      await updateProfile({
        ...values,
        profilePictureUrl: profilePictureUrl || void 0
      });
      await refreshProfile();
      pushToast({
        type: "success",
        title: "Perfil actualizado",
        description: "Tus preferencias fueron guardadas exitosamente."
      });
      reset(values);
    } catch (error) {
      pushToast({
        type: "error",
        title: "Error al actualizar",
        description: error.message || "No se pudo actualizar el perfil. Intenta nuevamente."
      });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Breadcrumbs, { items: [{ label: "Dashboard", to: "/" }, { label: "Perfil" }] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileCard, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "lg:col-span-2 card space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-slate-900 dark:text-white mb-1", children: "Editar Perfil" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600 dark:text-slate-400", children: "Actualiza tu información personal y preferencias" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ImageUpload,
          {
            currentImageUrl: user.profilePictureUrl,
            onImageChange: (url) => setProfilePictureUrl(url),
            label: "Foto de Perfil",
            maxSizeMB: 5
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TextField,
          {
            label: "Nombre completo",
            defaultValue: user.name,
            ...register("name"),
            error: (_a = errors.name) == null ? void 0 : _a.message,
            required: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-slate-700 dark:text-slate-200 mb-3", children: "Categorías Preferidas" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400 mb-3", children: "Selecciona las categorías de eventos que más te interesan" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 sm:grid-cols-2 md:grid-cols-3", children: categories.map((category) => {
            var _a2;
            const selected = ((_a2 = user.preferredCategories) == null ? void 0 : _a2.includes(category)) || false;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "label",
              {
                className: "flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-300 dark:hover:border-primary-700 cursor-pointer transition-colors",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "checkbox",
                      value: category,
                      defaultChecked: selected,
                      ...register("preferredCategories"),
                      className: "h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 focus:ring-offset-0"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-slate-700 dark:text-slate-300", children: category })
                ]
              },
              category
            );
          }) }),
          errors.preferredCategories && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-error-500", children: errors.preferredCategories.message })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-slate-200 dark:border-slate-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                reset();
                setProfilePictureUrl(user.profilePictureUrl || null);
              },
              className: "btn-secondary flex-1 sm:flex-none",
              disabled: isSubmitting,
              children: "Cancelar"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SubmitButton, { className: "flex-1 sm:flex-none", disabled: isSubmitting, children: isSubmitting ? "Guardando..." : "Guardar Cambios" })
        ] })
      ] })
    ] })
  ] });
};
export {
  ProfilePage as default
};
