import { useParams } from "react-router-dom";

import Profile from "../../components/Profile";

const TrainerProfile = () => {
  const { id } = useParams();
  
  return (
    <Profile id={id} kind="trainer" />
  );
};

export default TrainerProfile;
