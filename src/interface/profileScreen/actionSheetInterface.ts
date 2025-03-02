interface ImageProfile {
    uri: string;
    name: string;
    type: string;
}

interface UserProfile {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    image_profile: ImageProfile;
}

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

