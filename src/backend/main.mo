import Float "mo:core/Float";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";

actor {
  type Transaction = {
    date : Text;
    name : Text;
    amount : Float;
    narration : Text;
  };

  module Transaction {
    public func compare(transaction1 : Transaction, transaction2 : Transaction) : Order.Order {
      Float.compare(transaction1.amount, transaction2.amount);
    };
  };

  var nextId = 0;
  let transactions = Map.empty<Nat, Transaction>();

  public shared ({ caller }) func addTransaction(date : Text, name : Text, amount : Float, narration : Text) : async Nat {
    let id = nextId;
    let transaction : Transaction = {
      date;
      name;
      amount;
      narration;
    };
    transactions.add(id, transaction);
    nextId += 1;
    id;
  };

  public query ({ caller }) func getAllTransactions() : async [Transaction] {
    transactions.values().toArray().sort();
  };

  public shared ({ caller }) func deleteTransaction(id : Nat) : async () {
    if (not transactions.containsKey(id)) {
      Runtime.trap("Transaction with id " # id.toText() # " does not exist. ");
    };
    transactions.remove(id);
  };
};
