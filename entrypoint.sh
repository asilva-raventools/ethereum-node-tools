#!/bin/bash
DATADIR=/opt/ethereum/data
ADDRESS=`cat $DATADIR/build/.accounts`
geth --ipcdisable --config "$DATADIR/build/config.toml" --unlock "$ADDRESS" --password "$DATADIR/build/.password" --mine