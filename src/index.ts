import type { ActiveQuery } from "libkmodule";
import { addHandler, callModule } from "libkmodule";
import DiscoveryIRC from "@lumeweb/peer-discovery-irc";
import { handleMessage } from "libkmodule";
import { createClient } from "@lumeweb/kernel-peer-discovery-client";

onmessage = handleMessage;

const client = createClient();

async function handleRegister(aq: ActiveQuery) {
  try {
    await client.registerSelf();
  } catch (e) {
    aq.reject((e as Error).message);
    return;
  }

  aq.respond();
}

async function handleName(aq: ActiveQuery): Promise<void> {
  aq.respond("irc");
}

async function handleDiscover(aq: ActiveQuery): Promise<void> {
  if (!("pubkey" in aq.callerInput)) {
    aq.reject("pubkey required");
    return;
  }

  if (aq.callerInput.pubkey.length !== 32) {
    aq.reject("pubkey must be 32 bytes");
    return;
  }

  if (
    "options" in aq.callerInput &&
    typeof aq.callerInput.options !== "object"
  ) {
    aq.reject(`options must be an object`);
    return;
  }

  const ret = await DiscoveryIRC(aq.callerInput.pubkey, {
    host: "liberta.casa",
    ...aq.callerInput?.options,
  });

  aq.respond(ret);
}

addHandler("register", handleRegister);
addHandler("name", handleName);
addHandler("discover", handleDiscover);
