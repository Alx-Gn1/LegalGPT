import type { NextApiRequest, NextApiResponse } from "next";
// import { Configuration, OpenAIApi } from "openai";
import { verifyAuthApiRoutes } from "../utils/verifyAuthApiRoutes";
import { GptMessage, UserData } from "@/utils/interfaces";
import { OpenAI } from "openai-streams/node";

export default async function gptApi(req: NextApiRequest, res: NextApiResponse) {
  return new Promise(async (resolve, reject) => {
    if (!req.body || !req.headers) {
      resolve(res.status(401).json({ error: "Not Authorized" }));
      return;
    }
    const reqBody = JSON.parse(req.body) as {
      userId: number;
      userData: UserData;
      completeConversation: Array<GptMessage>;
    };
    const token = req.headers?.authorization?.split(" ")[1];
    if (verifyAuthApiRoutes({ userId: reqBody.userId, token }, res) === false) {
      resolve(res.status(401).json({ error: "Not Authorized" }));
    } else if (!reqBody?.userData) {
      resolve(res.status(200).json({ error: "No User Data" }));
    } else {
      const initialPrompt =
        `Tu es un avocat spécialisé dans le code pénal ainsi que le droit du travail en france.\n` +
        `Je suis ${reqBody.userData?.username}, ${reqBody.userData?.currentJob}.Je travaille à ${reqBody.userData?.fullOrPartTime} avec un contrat ${reqBody.userData?.contractType}.\n` +
        `Je vais te poser une ou plusieurs question(s) concernant mes droits en entreprise ou un litige avec un employeur, je veux que tu répondes à ces questions en citant
        les articles de lois correspondants, il est très important que tu indiques sur quel article de loi tu te base pour répondre à mes questions.\n` +
        `Si je te pose une question qui ne concerne ni droit pénal ni le droit en entreprise je veux que tu me dise que tu ne comprends pas la question\n`;

      const initialGptResponse =
        `Bonjour ${reqBody.userData?.username}, je suis ravi de pouvoir t'aider. N'hésite pas à me poser tes questions.\n` +
        "\n" +
        "Note : En tant qu'IA, je ne suis pas habilité à donner des conseils juridiques. Les informations fournies ci-dessous sont à titre informatif uniquement.\n";

      const GetLast3MessageOfConversation = () => {
        if (reqBody.completeConversation) {
          return reqBody.completeConversation.length >= 3
            ? [...reqBody.completeConversation.slice(-3)]
            : reqBody.completeConversation;
        } else return [];
      };
      const Last3MessageOfConversation = GetLast3MessageOfConversation();

      // ----------------------------------------------------------
      // Code pour communiquer avec chat gpt
      // ----------------------------------------------------------
      //

      const stream = await OpenAI(
        "chat",
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "user", content: initialPrompt },
            {
              role: "assistant",
              content: initialGptResponse,
            },
            {
              role: "user",
              content: "Mon employeur refuse de me payer mon salaire",
            },
            {
              role: "assistant",
              content:
                "Si ton employeur refuse de te payer ton salaire, il s'agit d'une violation de ses obligations contractuelles et légales. Tu as plusieurs options pour faire valoir tes droits :\n" +
                "\n" +
                "1. Demander à ton employeur de régulariser la situation : Dans un premier temps, tu peux essayer de résoudre le problème à l'amiable en demandant à ton employeur de te payer ce qui t'est dû. Il est important que tu gardes une trace écrite (par exemple par email) des échanges avec ton employeur.\n" +
                "\n" +
                "2. Engager une procédure devant le Conseil des Prud'hommes : Si la première option ne fonctionne pas, tu peux engager une procédure devant le Conseil des Prud'hommes pour obtenir le paiement de tes salaires impayés. Pour cela, il est recommandé d'être assisté par un avocat spécialisé en droit du travail.\n" +
                "\n" +
                "3. Faire appel à l'inspection du travail : Tu peux également contacter l'inspection du travail pour signaler la situation et demander leur intervention auprès de ton employeur.\n" +
                "\n" +
                "Il est important que tu agisses rapidement car les délais pour agir sont souvent courts en matière de droit du travail (par exemple 3 ans maximum pour réclamer des arriérés de salaires).",
            },
            ...Last3MessageOfConversation,
          ],
          temperature: 0.2,
          max_tokens: 2000,
          frequency_penalty: 1.2,
        },
        { apiKey: process.env.OPENAI_API_KEY }
      );

      stream.pipe(res);

      //
      // ----------------------------------------------------------
      // Code pour communiquer avec chat gpt
      // ----------------------------------------------------------

      //
      //
      // Exemple de conversation :
      //
      // newChatConversation: [
      // {
      //   role: "user",
      //   content:
      //     "Mon employeur veut me faire travailler jusqu'à minuit ce soir alors que j'ai commencé à 8h ce matin",
      // },
      // {
      //   role: "assistant",
      //   content:
      //     "Selon l'article L3121-29 du Code du travail, la durée quotidienne maximale de travail est fixée à 10 heures.\n" +
      //     "\n" +
      //     "De plus, selon l'article L3122-2 du Code du travail, le temps de repos quotidien doit être d'au moins 11 heures consécutives. Il est donc interdit pour un employeur de faire travailler un salarié jusqu'à minuit s'il commences à 8h le lendemain.\n" +
      //     "\n" +
      //     "En résumé, ton employeur ne peut pas te faire travailler jusqu'à minuit sans ton accord préalable et en respectant les règles sur la durée maximale quotidienne de travail et le temps de repos minimum.",
      // },
      //       {
      //         role: "user",
      //         content:
      //           "Un de mes employés n'est pas venu au travail depuis plus de 6 mois ! Qu'est ce que je peux faire ?",
      //       },
      //       {
      //         role: "assistant",
      //         content:
      //           "Dans ce cas, il est important de suivre la procédure légale pour mettre fin au contrat de travail de cet employé absent. \n" +
      //           "\n" +
      //           "Tout d'abord, tu dois envoyer une lettre recommandée avec accusé de réception à l'adresse du salarié en question, en lui demandant de reprendre son travail dans un délai raisonnable (généralement 8 jours). Cette lettre doit mentionner les conséquences d'une absence prolongée et le risque d'une rupture du contrat.\n" +
      //           "\n" +
      //           "Si le salarié ne répond pas ou ne reprend pas son travail dans le délai imparti, tu peux engager une procédure de licenciement pour abandon de poste. Pour cela, tu dois envoyer une seconde lettre recommandée avec accusé de réception informant le salarié que son absence prolongée est considérée comme un abandon de poste et que cela peut entraîner la rupture du contrat.\n" +
      //           "\n" +
      //           "Enfin, si malgré cette seconde mise en demeure le salarié ne donne toujours pas signe de vie ni ne reprend son travail dans un délai raisonnable (généralement 15 jours), tu peux prononcer la rupture du contrat pour faute grave.\n" +
      //           "\n" +
      //           "Il est important cependant que ces démarches soient effectuées avec l'aide d'un avocat spécialisé en droit du travail afin qu'elles soient conformes aux règles légales et éviter tout risque juridique.",
      //       },
      // {
      //   role: "user",
      //   content: "Mon employeur refuse de me payer mon salaire",
      // },
      // {
      //   role: "assistant",
      //   content:
      //     "Si ton employeur refuse de te payer ton salaire, il s'agit d'une violation de ses obligations contractuelles et légales. Tu as plusieurs options pour faire valoir tes droits :\n" +
      //     "\n" +
      //     "1. Demander à ton employeur de régulariser la situation : Dans un premier temps, tu peux essayer de résoudre le problème à l'amiable en demandant à ton employeur de te payer ce qui t'est dû. Il est important que tu gardes une trace écrite (par exemple par email) des échanges avec ton employeur.\n" +
      //     "\n" +
      //     "2. Engager une procédure devant le Conseil des Prud'hommes : Si la première option ne fonctionne pas, tu peux engager une procédure devant le Conseil des Prud'hommes pour obtenir le paiement de tes salaires impayés. Pour cela, il est recommandé d'être assisté par un avocat spécialisé en droit du travail.\n" +
      //     "\n" +
      //     "3. Faire appel à l'inspection du travail : Tu peux également contacter l'inspection du travail pour signaler la situation et demander leur intervention auprès de ton employeur.\n" +
      //     "\n" +
      //     "Il est important que tu agisses rapidement car les délais pour agir sont souvent courts en matière de droit du travail (par exemple 3 ans maximum pour réclamer des arriérés de salaires).",
      // },
      //     ],
      //   })
      // );
      //
      //
      //
    }
  });
}
