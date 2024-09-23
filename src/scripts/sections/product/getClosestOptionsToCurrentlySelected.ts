import { OptionList } from '../../../app-layer/util/typings';
import { OptionsMap } from './mapOptionsByImageIndex';

const getClosestOptionsToCurrentlySelected = (currentOptions: OptionList, matchingOptions: OptionsMap[]) : OptionsMap | undefined => {
  const scores = matchingOptions.map(variant => variant.options.reduce((acca, cv, index) => currentOptions[index] === cv ? acca + 1 : acca, 0));
  const index = scores.indexOf(Math.max(...scores));
  return matchingOptions[index];
}

export default getClosestOptionsToCurrentlySelected