import { useParams } from "react-router-dom";

import Profile from "../../components/Profile";

const HorseProfile = () => {
  const { id } = useParams();

  return (
    <Profile kind="horse" id={id} />
  );
};

export default HorseProfile;
