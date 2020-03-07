import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  private seatConfig: any = null;
  private seatmap = [];

  private seatChartConfig = {
    showRowsLabel: true,
    showRowWisePricing: false,
    newSeatNoForRow: true
  };

  private cart = {
    selectedSeats: [],
    seatstoStore: [],
    totalamount: 0,
    cartId: "",
    eventId: 0
  };

  title = "seat-chart-generator";

  // html = `<p>Seat : {{ seatobj.seatLabel }} | Price : {{
  //   seatobj.price
  // }}Rs</p><div><img src="../assets/images/download.jpg" alt="Watch" height="100%" width="100%"></div>`;

  ngOnInit(): void {
    //Process a simple bus layout
    this.seatConfig = [
      {
        building_name: "C",
        seat_price: 250,
        seat_map: [
          {
            seat_label: "2nd Floor",
            layout: "ggggg_ggggg",
            floor: "2",
            path: "../assets/images/StudioLoft.jpg"
          },
          {
            seat_label: "1st Floor",
            layout: "ggggg_ggggg",
            floor: "1",
            path: "../assets/images/Studio.jpg"
          },
          {
            seat_label: "Ground Floor",
            layout: "gggg___gggg",
            floor: "0",
            path: "../assets/images/BunkBed.jpg"
          }
        ]
      }
    ];
    this.processSeatChart(this.seatConfig);
  }

  public processSeatChart(map_data: any[]) {
    if (map_data.length > 0) {
      console.log(map_data);
      var seatNoCounter = 1;
      for (let __counter = 0; __counter < map_data.length; __counter++) {
        var row_label = "";
        var item_map = map_data[__counter].seat_map;
        console.log(item_map);

        //Get the label name and price
        row_label = "Row " + item_map[0].seat_label + " - ";
        console.log(row_label);

        if (item_map[item_map.length - 1].seat_label != " ") {
          row_label += item_map[item_map.length - 1].seat_label;
          console.log(row_label);
        } else {
          row_label += item_map[item_map.length - 2].seat_label;
          console.log(row_label);
        }
        row_label += " : Rs. " + map_data[__counter].seat_price;
        console.log(row_label);
        item_map.forEach(map_element => {
          var mapObj = {
            seatRowLabel: map_element.seat_label,
            seats: [],
            seatPricingInformation: row_label
          };
          console.log(mapObj);
          row_label = "";
          var seatValArr = map_element.layout.split("");
          if (this.seatChartConfig.newSeatNoForRow) {
            seatNoCounter = 1; //Reset the seat label counter for new row
          }
          var totalItemCounter = 1;
          seatValArr.forEach(item => {
            var seatObj = {
              key: map_element.seat_label + "_" + totalItemCounter,
              price: map_data[__counter]["seat_price"],
              path: map_element.path,
              status: "available"
            };

            if (item != "_") {
              seatObj["seatLabel"] =
                map_element.seat_label +
                " " +
                map_data[__counter].building_name +
                seatNoCounter;
              console.log(seatObj);

              if (seatNoCounter < 10) {
                seatObj["seatNo"] =
                  map_data[__counter].building_name +
                  map_element.floor +
                  "0" +
                  seatNoCounter;
              } else {
                seatObj["seatNo"] =
                  "" +
                  map_data[__counter].building_name +
                  map_element.floor +
                  seatNoCounter;
              }
              console.log(seatObj);

              seatNoCounter++;
            } else {
              seatObj["seatLabel"] = "";
            }
            totalItemCounter++;
            mapObj["seats"].push(seatObj);
          });
          console.log(" \n\n\n Seat Objects ", mapObj);
          this.seatmap.push(mapObj);
          console.log(this.seatmap);
        });
      }

      // for (let __counter = 0; __counter < map_data.length; __counter++) {
      //   var row_label = "";
      //   var rowLblArr = map_data[__counter]["seat_labels"];
      //   var seatMapArr = map_data[__counter]["seat_map"];
      //   for (let rowIndex = 0; rowIndex < rowLblArr.length; rowIndex++) {
      //     var rowItem = rowLblArr[rowIndex];
      //     var mapObj = {
      //       "seatRowLabel" : rowItem,
      //       "seats" : []
      //     };
      //     var seatValArr = seatMapArr[rowIndex].split('');
      //     var seatNoCounter = 1;
      //     var totalItemCounter = 1;
      //     seatValArr.forEach(item => {
      //       var seatObj = {
      //         "key" : rowItem+"_"+totalItemCounter,
      //         "price" : map_data[__counter]["seat_price"],
      //         "status" : "available"
      //       };

      //       if( item != '_')
      //       {
      //         seatObj["seatLabel"] = rowItem+" "+seatNoCounter;
      //         if(seatNoCounter < 10)
      //         { seatObj["seatNo"] = "0"+seatNoCounter; }
      //         else { seatObj["seatNo"] = ""+seatNoCounter; }

      //         seatNoCounter++;
      //       }
      //       else
      //       {
      //         seatObj["seatLabel"] = "";
      //       }
      //       totalItemCounter++;
      //       mapObj["seats"].push(seatObj);
      //     });
      //     console.log(" \n\n\n Seat Objects " , mapObj);
      //     this.seatmap.push( mapObj );
      //     console.log(" \n\n\n Seat Map " , this.seatmap);

      //   }

      // }
    }
  }

  public selectSeat(seatObject: any) {
    console.log("Seat to block: ", seatObject);
    if (seatObject.status == "available") {
      seatObject.status = "booked";
      this.cart.selectedSeats.push(seatObject.seatLabel);
      this.cart.seatstoStore.push(seatObject.key);
      this.cart.totalamount += seatObject.price;
    } else if ((seatObject.status = "booked")) {
      seatObject.status = "available";
      var seatIndex = this.cart.selectedSeats.indexOf(seatObject.seatLabel);
      if (seatIndex > -1) {
        this.cart.selectedSeats.splice(seatIndex, 1);
        this.cart.seatstoStore.splice(seatIndex, 1);
        this.cart.totalamount -= seatObject.price;
      }
    }
  }

  public blockSeats(seatsToBlock: string) {
    if (seatsToBlock != "") {
      var seatsToBlockArr = seatsToBlock.split(",");
      for (let index = 0; index < seatsToBlockArr.length; index++) {
        var seat = seatsToBlockArr[index] + "";
        var seatSplitArr = seat.split("_");
        console.log("Split seat: ", seatSplitArr);
        for (let index2 = 0; index2 < this.seatmap.length; index2++) {
          const element = this.seatmap[index2];
          if (element.seatRowLabel == seatSplitArr[0]) {
            var seatObj = element.seats[parseInt(seatSplitArr[1]) - 1];
            if (seatObj) {
              console.log("\n\n\nFount Seat to block: ", seatObj);
              seatObj["status"] = "unavailable";
              this.seatmap[index2]["seats"][
                parseInt(seatSplitArr[1]) - 1
              ] = seatObj;
              console.log("\n\n\nSeat Obj", seatObj);
              console.log(
                this.seatmap[index2]["seats"][parseInt(seatSplitArr[1]) - 1]
              );
              break;
            }
          }
        }
      }
    }
  }
}
