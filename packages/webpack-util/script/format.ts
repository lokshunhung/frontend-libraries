import {PrettierUtil} from "@pinnacle0/devtool-util/src";
import path from "path";

PrettierUtil.format(path.join(__dirname, "../script"));
PrettierUtil.format(path.join(__dirname, "../src"));
