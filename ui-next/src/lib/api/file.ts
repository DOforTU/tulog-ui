import apiClient from "./api-client";

export const uploadUserProfilePicture = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post("/api/files/upload?type=user", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    console.log("🧾 upload response:", response.data);

    return response.data.data.url;
};

export const uploadTeamImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post("/api/files/upload?type=team", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data.data.url;
};
