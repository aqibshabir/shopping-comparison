import { gsap } from "gsap";
const reverseGlobalText = (ref1, ref2, ref3) => {
  //List animation.
  gsap.fromTo(
    ref1.current,

    {
      opacity: 1,
      duration: 2,
      x: 0,
      y: -30,
      ease: "power3",
      stagger: 1.5,
    },
    {
      opacity: 0,
      autoAlpha: 1,
      duration: 3,
      x: 69,
      y: 259,
      ease: "power3",
      stagger: 1.5,
    }
  );

  //Shop animation.
  gsap.fromTo(
    ref2.current,

    {
      opacity: 1,
      duration: 2,
      x: 500,
      y: -200,
      ease: "power3",
      stagger: 1.5,
    },
    {
      opacity: 0,
      autoAlpha: 1,
      duration: 3,
      x: 69,
      y: 259,
      ease: "power3",
      stagger: 1.5,
    }
  );

  //Save animation.
  gsap.fromTo(
    ref3.current,
    {
      opacity: 1,
      duration: 2,
      x: 0,
      y: 0,
      ease: "power3",
      stagger: 1.5,
    },
    {
      opacity: 0,
      autoAlpha: 1,
      duration: 3,
      x: -69,
      y: -259,
      ease: "power3",
      stagger: 1.5,
    }
  );
};

export default reverseGlobalText;
