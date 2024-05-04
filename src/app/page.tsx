"use client";

import { nanoid } from "nanoid";
import { useMemo, useState } from "react";

import { GraphemeWithWords } from "@/app/components/GraphemeWithWords";
import { Navigation, navigationTypes } from "@/app/components/Navigation";
import { splitWord } from "@/app/components/WordCard";
import { PHONICS_LIST } from "@/app/constants/list";
import useHowler from "@/app/hooks/useHowler";
import useMeaning from "@/app/hooks/useMeaning";
import useVoiceSelector from "@/app/hooks/useVoiceSelector";

const Page = () => {
  const [navigationType, setNavigationType] = useState(navigationTypes[0]);
  const [voice, setVoice] = useState<SpeechSynthesisVoice>();

  const { meaningContent, showMeaning } = useMeaning();
  const { play } = useHowler();
  useVoiceSelector(setVoice);

  const phonicsList = useMemo(() => {
    return PHONICS_LIST.filter(
      ({ graphemeType }) => graphemeType === navigationType,
    ).map((item) => {
      const { phoneme, grapheme, pronunciation, words, tips } = item;
      const graphemeCard = {
        grapheme,
        pronunciation,
        onClick: () => {
          play(phoneme);
          showMeaning({
            wordList: [{ word: grapheme }],
            chinese_meanings: tips,
          });
        },
      };

      const wordCards = words.map((word) => {
        return {
          voice,
          grapheme,
          word: word.word,
          onClick: () => {
            showMeaning({
              word: word.word,
              pronunciation: word.pronunciation,
              chinese_meanings: word.chinese_meanings,
              wordList: splitWord(word.word, grapheme),
            });
          },
        };
      });

      return (
        <div key={nanoid()}>
          <GraphemeWithWords
            graphemeCard={graphemeCard}
            wordCards={wordCards}
          />
        </div>
      );
    });
  }, [navigationType, voice]); // do not add `play`, `showMeaning`

  return (
    <main className="font-sans bg-paper pb-20">
      <h1 className="text-center text-3xl lg:text-6xl font-doodle">
        ✨ Phonics
        <span className="text-2xl lg:text-4xl ml-4">
          /<span className="font-bold underline">fon</span>-iks/
        </span>
      </h1>

      <Navigation
        navigationType={navigationType}
        setNavigationType={setNavigationType}
      />

      {phonicsList}

      <footer className="text-center text-xs font-playpen content-visibility-auto">
        <div className="font-doodle text-xl">Thanks</div>
        <a
          href="https://www.flaticon.com/free-stickers/speech"
          title="speech stickers"
          target="_blank"
        >
          All stickers created by Gohsantosadrive - Flaticon
        </a>

        <div className="font-doodle text-xl">Contact</div>
        <a href="mailto:s5s5cn@gmail.com">s5s5cn@gmail.com</a>
      </footer>

      {meaningContent}
    </main>
  );
};

export default Page;
