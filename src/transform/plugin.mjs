import { getVisitor } from './visit.mjs';

export default function (context) {
  return {
    visitor: getVisitor(context),
  };
}

