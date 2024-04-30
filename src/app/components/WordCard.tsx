import useSpeechSynthesis from "beautiful-react-hooks/useSpeechSynthesis";
import { nanoid } from "nanoid";
import Image from "next/image";
import { useMemo } from "react";

type WordCardProps = {
  word: string;
  grapheme: string;
  voice?: SpeechSynthesisVoice;
  onClick: () => void;
};

const WordCard = ({ word, grapheme, voice, onClick }: WordCardProps) => {
  let speech = { speak: () => {} };
  if (
    typeof window !== "undefined" &&
    typeof window["speechSynthesis"] !== "undefined"
  ) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    speech = useSpeechSynthesis(word, { voice, rate: 0.7 });
  }
  const wordList = useMemo(() => splitWord(word, grapheme), [word, grapheme]);

  return (
    <div
      className="m-1 rounded-xl border-4 border-gray-700 border-dotted transition duration-300 hover:bg-indigo-500 hover:text-white hover:border-white cursor-pointer"
      onClick={() => {
        speech.speak();
        onClick();
      }}
    >
      <Image
        className="mx-auto my-5"
        // src={`/api/getPicUrl?word=${word}`}
        src={`/images/words/${word}.png`}
        width={60}
        height={60}
        alt={word}
      />

      <div className="text-center mb-6 font-playpen text-base">
        {wordList.map(({ word, highLight }) => {
          if (highLight) {
            return (
              <span className="text-red-500 font-bold underline" key={nanoid()}>
                {word}
              </span>
            );
          }
          return <span key={nanoid()}>{word}</span>;
        })}
      </div>
    </div>
  );
};

const splitWord = (
  word: string,
  grapheme: string,
): { word: string; highLight?: boolean }[] => {
  if (grapheme.includes("_")) {
    const regex = new RegExp(grapheme.replace("_", "."), "gi");
    const index = word.search(regex);
    const first = word.slice(0, index);
    let second = word.slice(index, index + grapheme.length);
    const end = word.slice(index + grapheme.length);
    const graphemes = grapheme.split("_");
    graphemes.forEach((g) => {
      second = second.replace(g, "");
    });
    return [
      { word: first },
      { word: graphemes[0], highLight: true },
      { word: second },
      { word: graphemes[1], highLight: true },
      { word: end },
    ];
  }

  const index = word.indexOf(grapheme);
  const first = word.slice(0, index);
  const second = word.slice(index + grapheme.length);
  return [
    { word: first },
    { word: grapheme, highLight: true },
    { word: second },
  ];
};

export { splitWord, WordCard, type WordCardProps };
