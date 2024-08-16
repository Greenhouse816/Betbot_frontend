import { useParams } from "react-router-dom";

import Profile from "../../components/Profile";

const JockeyProfile = () => {
  const { id } = useParams();

  return (
    <Profile id={id} kind="jockey" />
  );
};

export default JockeyProfile;
