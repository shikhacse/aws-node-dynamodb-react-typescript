import genericImage from "../../assets/Carrington-Hall.png";
import { SpaceEntry } from "../model/model";
import './SpaceComponent.css';

interface SpaceComponentProps extends SpaceEntry {
  reserveSpace: (spaceId: string, spaceName: string) => void;
}


export default function SpaceComponent(props: SpaceComponentProps) {
  function renderImage() {
    console.log(props)
    if (props.photoUrl) {
      return <img src={props.photoUrl}/>;
    } else {
      return <img src={genericImage}/>;
    }
  }

  return (
    <div className="spaceComponent">
      {renderImage()}
      <label className="name">{props.name}</label>
      <br />
      <label className="location">{props.location}</label>
      <br />
      <button onClick={() => props.reserveSpace(props.id, props.name)}>Reserve</button>
    </div>
  );
}