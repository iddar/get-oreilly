#!/bin/bash

cd pdf

for i in $( ls ); do
    if [[ $i != *".pdf"* ]]
    then
      echo $i
      mv $i $i.pdf
    fi
done

cd ..
cd epub

for i in $( ls ); do
    if [[ $i != *".epub"* ]]
    then
      echo $i
      mv $i $i.epub
    fi
done

cd ..
