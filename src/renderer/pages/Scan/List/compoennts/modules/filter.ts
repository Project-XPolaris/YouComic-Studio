import { Directory, ScanModelStateType } from '@/pages/Scan/List/model';
import { Book } from '@/services/youcomic/model';
const filterActionMapping : {[key:string] : (state:ScanModelStateType,item : Directory) => boolean} = {
  "title":(state,item) => {
    return item.title !== undefined && item.title.length !== 0
  },
  "noTitle":(state,item) => {
    return item.title === undefined || item.title.length === 0
  },
  "artist":(state,item) => {
    return item.matchInfo.artist !== undefined
  },
  "noArtist":(state,item) => {
    return item.matchInfo.artist === undefined
  },
  "series":(state,item) => {
    return item.matchInfo.series !== undefined
  },
  "noSeries":(state,item) => {
    return item.matchInfo.series === undefined
  },
  "theme":(state,item) => {
    return item.matchInfo.theme !== undefined
  },
  "noTheme":(state,item) => {
    return item.matchInfo.theme === undefined
  },
  "exist":(state,item) => {
    return state.existBook.find((book:Book) => book.name === item.title) !== undefined
  },
  "notexist":(state,item) => {
    return state.existBook.find((book:Book) => book.name === item.title) === undefined
  }
}
export default {
  effects:{

  },
  reducers:{
    setDirFilter(state:ScanModelStateType,{payload:{filter}}):ScanModelStateType{
      console.log(filter)
      let dirs = [...state.directoryList];
      filter.forEach((filterKey:string) => {
        console.log(filterKey)
        dirs = dirs.filter((dir:Directory) => !filterActionMapping[filterKey](state,dir))
      })
      return{
        ...state,
        filter,
        displayList:dirs.map((item) => item.path)
      }
    }
  }
}
