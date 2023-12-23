import { Howl } from "howler";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function useHowler() {
  const [sound, setSound] = useState<Howl | undefined>(undefined);
  const [phoneme, setPhoneme] = useState<string | undefined>(undefined);

  const play = useCallback(
    (newPhoneme: string) => {
      if (!newPhoneme) return;
      if (newPhoneme !== phoneme) {
        const newSound = new Howl({
          src: [`/audio/${newPhoneme}.mp3`],
          autoplay: true,
        });
        setSound(newSound);
        setPhoneme(newPhoneme);
        return;
      }
      if (!sound) return;
      sound.stop();
      sound.play();
    },
    [phoneme, sound],
  );

  useEffect(() => {
    return () => {
      if (!sound) return;
      sound.stop();
      sound.unload();
    };
  }, [sound]);

  return { play };
}
