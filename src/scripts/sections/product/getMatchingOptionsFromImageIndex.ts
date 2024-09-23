import {OptionsMap} from './mapOptionsByImageIndex'

const getMatchingOptionsFromImageIndex = (optionsMapping: OptionsMap[], position: number) : OptionsMap[] => {
  const matches = optionsMapping.filter(optionsMap => (optionsMap.imagePosition === position))
  return matches;
}

export default getMatchingOptionsFromImageIndex