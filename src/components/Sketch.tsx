import { ReactP5Wrapper } from "@p5-wrapper/react";

const SketchWrapper: React.FC<{sketch:()=> undefined}> = ({sketch}) => {
    return <ReactP5Wrapper sketch={sketch} />;
  }
export default SketchWrapper