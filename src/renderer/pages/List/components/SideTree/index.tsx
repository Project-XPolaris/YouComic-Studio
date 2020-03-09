import React from 'react';
import { connect } from 'dva';
import { Dropdown, Menu, Tree } from 'antd';
import { FileListModelStateType } from '@/models/filelist';
import AllElectron = Electron.AllElectron;
import { HomeModelStateType } from '@/pages/Home/model';
import styles from './style.less';
import { DirectoryModelStateType } from '@/models/directory';
// @ts-ignore
const electron: AllElectron = window.require('electron');
const remote = electron.remote;
const fs = electron.remote.require('fs');

const { TreeNode, DirectoryTree } = Tree;

export interface ChildrenItem {
  children: ChildrenItem[]
  name: string
  path: string
  type: string
  size: string
}

interface SideTreePropsType {
  dispatch: any,
  fileList: FileListModelStateType
  home: HomeModelStateType
  directory:DirectoryModelStateType
}

function SideTree({ dispatch, fileList, home,directory }: SideTreePropsType) {
  const renderTree = () => {
    if (fileList.tree === undefined) {
      return undefined;
    }

    function renderItem(node: ChildrenItem) {
      if (node.type === "directory"){
        return (
          <TreeNode title={node.name} key={node.path}>
            {node.children.map(item => renderItem(item))}
          </TreeNode>
        )
      }else{
        // return (
        //   <TreeNode title={node.name} key={node.path} isLeaf />
        // )
        return undefined
      }
    }
    return renderItem(fileList.tree);

    // while (walkQueue.length !== 0) {
    //   const node = walkQueue.shift();
    //   if ('children' in node) {
    //     walkQueue.push(...node.children);
    //   }
    //   itemList.push({ name: node.name, path: node.path, type: node.type });
    // }
    return undefined;
    // return fileList.tree.map(name => {
    //   return (
    //     <TreeNode title={name} key={`${home}/${name}`}>
    //       <TreeNode title="leaf 0-0" key="0-0-0" isLeaf />
    //     </TreeNode>
    //   )
    // })
  };
  const onItemSelect = (selectedKeys) => {
    dispatch({
      type:"directory/setPath",
      payload:{
        path:selectedKeys[0]
      }
    })
  };
  const getSelectKey = () => {
    if (directory.path === undefined){
      return []
    }
    return [directory.path,]
  };
  return (
    <div>
      <DirectoryTree onSelect={onItemSelect} selectedKeys={getSelectKey()} defaultExpandAll>
        {renderTree()}
      </DirectoryTree>
    </div>
  );
}

export default connect(({ fileList, home,directory }) => ({ fileList, home,directory }))(SideTree);
