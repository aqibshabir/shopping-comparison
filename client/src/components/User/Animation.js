import { gsap } from "gsap";

const animateText = (ref1, ref2, ref3) => {
  //List animation.
  gsap
    .from(ref1.current, {
      duration: 5,
      opacity: 0,
      ease: "slow(0.5, 0.7, true)",
    })
    .delay(1);

  //Shop animation.
  gsap
    .from(ref2.current, {
      duration: 5,
      opacity: 0,
      ease: "slow(0.5, 0.7, true)",
    })
    .delay(2);

  //Save animation.
  gsap
    .from(ref3.current, {
      duration: 5,
      opacity: 0,
      ease: "slow(0.5, 0.7, true)",
    })
    .delay(3);
};

export default animateText;
