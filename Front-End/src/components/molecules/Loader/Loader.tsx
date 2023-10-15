import DotLoader from "react-spinners/DotLoader";
import "./Loader.scss";

/** Props interface */
interface Props {
  loading: boolean;
}

/** Component that renders a loader */
const Loader = ({ loading }: Props) => {
  return (
    <>
      {loading ? (
        <div className="loader-overlay">
          <DotLoader
            color="#7b001e"
            loading={loading}
            size={150}
            aria-label="Cargando"
          />
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Loader;
